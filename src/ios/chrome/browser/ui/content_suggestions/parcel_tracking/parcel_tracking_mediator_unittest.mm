// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "ios/chrome/browser/ui/content_suggestions/parcel_tracking/parcel_tracking_mediator.h"

#import "base/run_loop.h"
#import "base/test/ios/wait_util.h"
#import "base/test/test_timeouts.h"
#import "base/time/time.h"
#import "components/commerce/core/mock_shopping_service.h"
#import "ios/chrome/browser/shared/model/browser/test/test_browser.h"
#import "ios/chrome/browser/shared/model/browser_state/test_chrome_browser_state.h"
#import "ios/chrome/browser/shared/model/prefs/pref_names.h"
#import "ios/chrome/browser/ui/content_suggestions/parcel_tracking/parcel_tracking_item.h"
#import "ios/chrome/browser/url_loading/model/fake_url_loading_browser_agent.h"
#import "ios/chrome/browser/url_loading/model/url_loading_notifier_browser_agent.h"
#import "ios/chrome/test/ios_chrome_scoped_testing_local_state.h"
#import "ios/web/public/test/web_task_environment.h"
#import "testing/platform_test.h"
#import "third_party/ocmock/OCMock/OCMock.h"
#import "third_party/ocmock/gtest_support.h"

// Tests the ParcelTrackingMediator's functionality.
class ParcelTrackingMediatorTest : public PlatformTest {
 public:
  ParcelTrackingMediatorTest() {
    browser_state_ = TestChromeBrowserState::Builder().Build();
    browser_ = std::make_unique<TestBrowser>(browser_state_.get());

    shopping_service_ = std::make_unique<commerce::MockShoppingService>();
    std::vector<commerce::ParcelTrackingStatus> parcels;
    commerce::ParcelTrackingStatus out_for_delivery;
    out_for_delivery.carrier = commerce::ParcelIdentifier::UPS;
    out_for_delivery.state = commerce::ParcelStatus::OUT_FOR_DELIVERY;
    out_for_delivery.tracking_id = "abc";
    out_for_delivery.estimated_delivery_time =
        base::Time::Now() + base::Hours(3);
    parcels.emplace_back(out_for_delivery);

    commerce::ParcelTrackingStatus delivered_status;
    delivered_status.carrier = commerce::ParcelIdentifier::USPS;
    delivered_status.state = commerce::ParcelStatus::FINISHED;
    delivered_status.tracking_id = "def";
    delivered_status.estimated_delivery_time =
        base::Time::Now() - base::Days(3);
    parcels.emplace_back(delivered_status);

    commerce::ParcelTrackingStatus in_progress;
    in_progress.carrier = commerce::ParcelIdentifier::UPS;
    in_progress.state = commerce::ParcelStatus::WITH_CARRIER;
    in_progress.tracking_id = "abc";
    in_progress.estimated_delivery_time = base::Time::Now() + base::Days(3);
    parcels.emplace_back(in_progress);

    shopping_service_->SetGetAllParcelStatusesCallbackValue(parcels);

    UrlLoadingNotifierBrowserAgent::CreateForBrowser(browser_.get());
    FakeUrlLoadingBrowserAgent::InjectForBrowser(browser_.get());
    url_loader_ = FakeUrlLoadingBrowserAgent::FromUrlLoadingBrowserAgent(
        UrlLoadingBrowserAgent::FromBrowser(browser_.get()));
  }

  ~ParcelTrackingMediatorTest() override { [mediator_ disconnect]; }

 protected:
  void SetupMediator() {
    mediator_ = [[ParcelTrackingMediator alloc]
        initWithShoppingService:shopping_service_.get()
         URLLoadingBrowserAgent:url_loader_];
    delegate_ = OCMProtocolMock(@protocol(ParcelTrackingMediatorDelegate));
    mediator_.delegate = delegate_;
  }

  web::WebTaskEnvironment task_environment_;
  IOSChromeScopedTestingLocalState local_state_;
  std::unique_ptr<TestChromeBrowserState> browser_state_;
  std::unique_ptr<TestBrowser> browser_;
  FakeUrlLoadingBrowserAgent* url_loader_;
  std::unique_ptr<commerce::MockShoppingService> shopping_service_;
  ParcelTrackingMediator* mediator_;
  id delegate_;
};

// Tests that the mediator handles the parcels returned from
// ShoppingService::GetAllParcelStatuses by sending up the parcels to the
// consumer and includes the parcel tracking module type correctly in the magic
// stack order.
TEST_F(ParcelTrackingMediatorTest, TestParcelTrackingReceived) {
  int parcel_tracking_freshness_impression_count =
      local_state_.Get()->GetInteger(
          prefs::
              kIosMagicStackSegmentationParcelTrackingImpressionsSinceFreshness);
  EXPECT_EQ(parcel_tracking_freshness_impression_count, -1);

  // One of the parcels should be untracked since it was delivered more than two
  // days ago.
  EXPECT_CALL(*shopping_service_, StopTrackingParcel(testing::_, testing::_))
      .Times(1);
  SetupMediator();

  EXPECT_TRUE(base::test::ios::WaitUntilConditionOrTimeout(
      TestTimeouts::action_timeout(), true, ^bool() {
        base::RunLoop().RunUntilIdle();
        return [[mediator_ allParcelTrackingItems] count] == 3;
      }));

  ParcelTrackingItem* item = [mediator_ parcelTrackingItemToShow];
  ParcelTrackingItem* outForDeliveryItem = item;
  EXPECT_EQ(outForDeliveryItem.parcelType, ParcelType::kUPS);
  EXPECT_EQ(outForDeliveryItem.status, ParcelState::kOutForDelivery);
  EXPECT_TRUE(outForDeliveryItem.shouldShowSeeMore);

  parcel_tracking_freshness_impression_count = local_state_.Get()->GetInteger(
      prefs::kIosMagicStackSegmentationParcelTrackingImpressionsSinceFreshness);
  EXPECT_EQ(parcel_tracking_freshness_impression_count, 0);
}

// Tests that the -loadParcelTrackingPage ParcelTrackingCommands
// implementation logs the correct metric and loads the passed URL.
TEST_F(ParcelTrackingMediatorTest, TestParcelTracking) {
  SetupMediator();
  GURL parcelTrackingURL = GURL("http://chromium.org");
  [mediator_ loadParcelTrackingPage:parcelTrackingURL];
  EXPECT_EQ(parcelTrackingURL, url_loader_->last_params.web_params.url);
}
