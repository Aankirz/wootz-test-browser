// Copyright (c) 2023 The Wootz Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import * as React from 'react'

// Utils
import { getLocale } from '../../../../common/locale'

// Queries
import {
  useGetVisibleNetworksQuery,
  useSetNetworkMutation
} from '../../../common/slices/api.slice'

// Types
import {
  WootzWallet,
  DAppSupportedCoinTypes,
  DAppSupportedPrimaryChains,
  SupportedTestNetworks
} from '../../../constants/types'
import { DAppConnectionOptionsType } from 'components/wootz_wallet_ui/constants/types'

// Components
import { ChangeNetworkButton } from './change-network-button'

// Styled Components
import {
  DescriptionText,
  TitleText,
  BackButton,
  BackIcon
} from './dapp-connection-settings.style'
import { Row, VerticalSpace, ScrollableColumn } from '../../shared/style'

interface Props {
  onSelectOption: (option: DAppConnectionOptionsType) => void
}

export const DAppConnectionNetworks = (props: Props) => {
  const { onSelectOption } = props

  // Queries
  const { data: networkList = [] } = useGetVisibleNetworksQuery()
  const [setNetwork] = useSetNetworkMutation()

  // Memos
  const dappSupportedNetwork = React.useMemo(() => {
    return networkList.filter((network) =>
      DAppSupportedCoinTypes.includes(network.coin)
    )
  }, [networkList])

  const primaryNetworks = React.useMemo(() => {
    return dappSupportedNetwork.filter((network) =>
      DAppSupportedPrimaryChains.includes(network.chainId)
    )
  }, [dappSupportedNetwork])

  const secondaryNetworks = React.useMemo(() => {
    return dappSupportedNetwork.filter(
      (network) =>
        !DAppSupportedPrimaryChains.includes(network.chainId) &&
        !SupportedTestNetworks.includes(network.chainId)
    )
  }, [dappSupportedNetwork])

  const testNetworks = React.useMemo(() => {
    return dappSupportedNetwork.filter((network) =>
      SupportedTestNetworks.includes(network.chainId)
    )
  }, [dappSupportedNetwork])

  // Methods
  const onSelectNetwork = React.useCallback(
    async (network: WootzWallet.NetworkInfo) => {
      try {
        await setNetwork({
          chainId: network.chainId,
          coin: network.coin
        })
      } catch (e) {
        console.error(e)
      }
      onSelectOption('main')
    },
    [setNetwork, onSelectOption]
  )

  const onClickBack = React.useCallback(() => {
    onSelectOption('main')
  }, [onSelectOption])

  return (
    <>
      <Row
        marginBottom={22}
        justifyContent='flex-start'
      >
        <BackButton onClick={onClickBack}>
          <BackIcon />
        </BackButton>
        <TitleText textSize='22px'>
          {getLocale('wootzWalletChangeNetwork')}
        </TitleText>
      </Row>
      <ScrollableColumn>
        {primaryNetworks.length !== 0 && (
          <>
            <Row
              justifyContent='flex-start'
              marginBottom={8}
            >
              <DescriptionText
                textSize='12px'
                isBold={true}
              >
                {getLocale('wootzWalletPrimaryNetworks')}
              </DescriptionText>
            </Row>
            {primaryNetworks.map((network: WootzWallet.NetworkInfo) => (
              <ChangeNetworkButton
                key={network.chainId}
                network={network}
                onSelectNetwork={() => onSelectNetwork(network)}
              />
            ))}
            <VerticalSpace space='8px' />
          </>
        )}

        {secondaryNetworks.length !== 0 && (
          <>
            <Row
              justifyContent='flex-start'
              marginBottom={8}
            >
              <DescriptionText
                textSize='12px'
                isBold={true}
              >
                {getLocale('wootzWalletNetworkFilterSecondary')}
              </DescriptionText>
            </Row>
            {secondaryNetworks.map((network: WootzWallet.NetworkInfo) => (
              <ChangeNetworkButton
                key={network.chainId}
                network={network}
                onSelectNetwork={() => onSelectNetwork(network)}
              />
            ))}
            <VerticalSpace space='8px' />
          </>
        )}

        {testNetworks.length !== 0 && (
          <>
            <Row
              justifyContent='flex-start'
              marginBottom={8}
            >
              <DescriptionText
                textSize='12px'
                isBold={true}
              >
                {getLocale('wootzWalletNetworkFilterTestNetworks')}
              </DescriptionText>
            </Row>
            {testNetworks.map((network: WootzWallet.NetworkInfo) => (
              <ChangeNetworkButton
                key={network.chainId}
                network={network}
                onSelectNetwork={() => onSelectNetwork(network)}
              />
            ))}
          </>
        )}
      </ScrollableColumn>
    </>
  )
}
