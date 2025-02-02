// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef CHROME_BROWSER_UI_WEBUI_ASH_LOGIN_GAIA_PASSWORD_CHANGED_SCREEN_HANDLER_H_
#define CHROME_BROWSER_UI_WEBUI_ASH_LOGIN_GAIA_PASSWORD_CHANGED_SCREEN_HANDLER_H_

#include <string>

#include "base/memory/weak_ptr.h"
#include "chrome/browser/ui/webui/ash/login/base_screen_handler.h"

namespace ash {

// TODO(b/315829727): remove now unused handler + all dependent resources.
// Interface for dependency injection between GaiaPasswordChangedScreen and its
// WebUI representation.
class GaiaPasswordChangedView {
 public:
  inline constexpr static StaticOobeScreenId kScreenId{
      "gaia-password-changed", "GaiaPasswordChangedScreen"};

  virtual ~GaiaPasswordChangedView() = default;

  // Shows the contents of the screen.
  virtual void Show(const std::string& email, bool has_error) = 0;

  virtual void Show(const std::string& email) = 0;
  virtual void ShowWrongPasswordError() = 0;
  virtual void SuggestRecovery() = 0;
  virtual base::WeakPtr<GaiaPasswordChangedView> AsWeakPtr() = 0;
};

class GaiaPasswordChangedScreenHandler final : public GaiaPasswordChangedView,
                                               public BaseScreenHandler {
 public:
  using TView = GaiaPasswordChangedView;

  GaiaPasswordChangedScreenHandler();
  GaiaPasswordChangedScreenHandler(const GaiaPasswordChangedScreenHandler&) =
      delete;
  GaiaPasswordChangedScreenHandler& operator=(
      const GaiaPasswordChangedScreenHandler&) = delete;
  ~GaiaPasswordChangedScreenHandler() override;

 private:
  void Show(const std::string& email, bool has_error) override;
  void Show(const std::string& email) override;
  void ShowWrongPasswordError() override;
  void SuggestRecovery() override;
  base::WeakPtr<GaiaPasswordChangedView> AsWeakPtr() override;

  // BaseScreenHandler:
  void DeclareLocalizedValues(
      ::login::LocalizedValuesBuilder* builder) override;

  base::WeakPtrFactory<GaiaPasswordChangedView> weak_ptr_factory_{this};
};

}  // namespace ash

#endif  // CHROME_BROWSER_UI_WEBUI_ASH_LOGIN_GAIA_PASSWORD_CHANGED_SCREEN_HANDLER_H_
