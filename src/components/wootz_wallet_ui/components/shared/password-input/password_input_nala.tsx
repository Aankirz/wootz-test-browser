// Copyright (c) 2024 The Wootz Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'
import { type InputEvent } from '@wootz/leo/react/input'

// utils
import { getLocale } from '../../../../common/locale'

// style
import { Row, Text, ToggleVisibilityButton } from '../style'
import { ToggleVisibilityIcon } from './password-input-v2.style'
import { FullWidthInput, LockIcon } from './password_input_nala.style'

export const PasswordInputNala = ({
  onChange,
  onKeyDown,
  isCorrectPassword,
  password
}: {
  onChange?: InputEvent
  onKeyDown?: InputEvent
  password: string
  isCorrectPassword: boolean
}) => {
  // state
  const [showPassword, setShowPassword] = React.useState(false)

  // render
  return (
    <FullWidthInput
      onInput={onChange}
      onKeyDown={onKeyDown}
      placeholder={getLocale('wootzWalletEnterYourPassword')}
      showErrors={!!password && !isCorrectPassword}
      value={password}
      type={showPassword ? 'text' : 'password'}
      mode='outline'
    >
      <div>
        {/* Label */}
        {getLocale('wootzWalletInputLabelPassword')}
      </div>

      <LockIcon slot='left-icon' />

      <div slot='right-icon'>
        <ToggleVisibilityButton
          isVisible={showPassword}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          <ToggleVisibilityIcon name={showPassword ? 'eye-off' : 'eye-on'} />
        </ToggleVisibilityButton>
      </div>

      <Row
        slot='errors'
        justifyContent='flex-start'
        alignItems='center'
        margin='4px 0px 0px 0px'
        padding='2px 6px'
      >
        <Text
          textSize='16px'
          textColor='error'
        >
          {getLocale('wootzWalletLockScreenError')}
        </Text>
      </Row>
    </FullWidthInput>
  )
}

export default PasswordInputNala
