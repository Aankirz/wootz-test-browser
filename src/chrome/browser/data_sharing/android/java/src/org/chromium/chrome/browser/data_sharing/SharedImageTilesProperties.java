// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

package org.chromium.chrome.browser.data_sharing;

import org.chromium.ui.modelutil.PropertyKey;
import org.chromium.ui.modelutil.PropertyModel;

/** List of properties used by the SharedImageTiles component. */
class SharedImageTilesProperties {
    // This will indicate the loading state of the shared_image_tiles view.
    public static final PropertyModel.WritableBooleanPropertyKey IS_LOADING =
            new PropertyModel.WritableBooleanPropertyKey();

    public static final PropertyModel.WritableIntPropertyKey BACKGROUND_COLOR =
            new PropertyModel.WritableIntPropertyKey();

    public static final PropertyModel.WritableIntPropertyKey REMAINING_TILES =
            new PropertyModel.WritableIntPropertyKey();

    public static final PropertyKey[] ALL_KEYS = {IS_LOADING, BACKGROUND_COLOR, REMAINING_TILES};
}
