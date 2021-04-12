import { TitleBar } from '@shopify/app-bridge-react';
import { EmptyState, Layout, Page, TextStyle } from '@shopify/polaris'
import React from 'react'

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

function Index() {
  return (
    <Page>
      <TitleBar
        title="Loop Subscriptions App"
        primaryAction={{
          content: 'Select Products',
        }}
      />
      <Layout>
        <EmptyState 
          heading="Discount your products temporarily"
          action={{
            content: 'Select products',
            onAction: () => console.log('clicked'),
          }}
          image={img}
        />
          <p>Select products to change their price temporarily</p>
      </Layout>
    </Page>
  )
}

export default Index
