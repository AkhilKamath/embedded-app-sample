import { Card, Layout, Page } from '@shopify/polaris'
import React from 'react'

function Install() {
  return (
    <Page>
      <Layout>
        <Layout.AnnotatedSection
          title="Install Product widget"
          description="Automatically installs the widget on your product theme templates. More Info."
        >
          <Card sectioned>
            <div>This is a Card</div>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  )
}

export default Install
