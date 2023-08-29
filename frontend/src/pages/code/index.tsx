import Code from "@components/common/Code";

type HighlightProps = {
  children: React.ReactNode
}

const Highlight = ({ children }: HighlightProps) => (
  <span className="text-orange-400">{children}</span>
)

const CodePage = () => (
  <main className="flex flex-col min-h-screen items-center justify-center overflow-x-hidden">
    <h1 className="text-3xl mb-12">Register to Village Cleanup</h1>
    <div className="flex flex-col gap-5 items-center">
      <p>1. Search for <Highlight>@TalkooBot</Highlight> in Telegram</p>
      <p>2. Start the web app from the <Highlight>Open</Highlight> button</p>
      <p>3. Press <Highlight>Register</Highlight> and follow the instructions</p>
      <p>4. Scan this <Highlight>QR code</Highlight> to finish your registration!</p>
    </div>
    <div className="my-20">
      <Code />
    </div>
    <div className="flex flex-col gap-1 w-1/3 text-center">
      <small>
        Disclaimer: Information about your Telegram account and contact information (if provided)
        will be recorded to track your participation time and for contacting purposes.
      </small>
      <small>
        <em>You can also help in cleaning the village without registering!</em>
      </small>

    </div>
  </main>
)

export default CodePage;