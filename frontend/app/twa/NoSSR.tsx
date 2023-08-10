import React from "react"
import dynamic from "next/dynamic"

const NoSSR = ({ children }: React.PropsWithChildren) => (
  <>
    { children }
  </>
)

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false
})