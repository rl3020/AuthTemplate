// A <script> rendered by React needs type="text/plain" on the client — the
// browser then ignores it as inert markup instead of re-running it — since
// the server already executed it inline before hydration. That's also what
// keeps React's dev warning about rendering raw <script> tags quiet.
// See: https://nextjs.org/docs/app/guides/preventing-flash-before-hydration
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
