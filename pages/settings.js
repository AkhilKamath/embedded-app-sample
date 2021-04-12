import { Card, Layout, Page } from '@shopify/polaris'
import React from 'react'

function Settings() {
  return (
    <Page>
      <Layout>
        <Layout.AnnotatedSection
          title="Settings 1"
          description="Automatically Settings 1"
        >
          <Card sectioned>
            <div>This is a Card</div>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  )
}

export default Settings
