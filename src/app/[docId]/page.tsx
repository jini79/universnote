// src/app/[docId]/page.tsx
import EditorClient from "../components/EditorClient";

export default async function DocumentPage(props: any) {
  const { params } = await props;
  return <EditorClient docId={params.docId} />;
}
