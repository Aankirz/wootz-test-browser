// Copyright 2015 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "content/common/input/render_widget_host_view_input_observer.h"

namespace content {

RenderWidgetHostViewInputObserver::~RenderWidgetHostViewInputObserver() =
    default;

void RenderWidgetHostViewInputObserver::OnRenderWidgetHostViewInputDestroyed(
    RenderWidgetHostViewInput*) {}

}  // namespace content
