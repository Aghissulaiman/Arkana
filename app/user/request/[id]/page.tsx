import RequestPickupPage from "@/components/Users/Request/Raquest";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Reques({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <>
      <RequestPickupPage agentId={resolvedParams.id} />
    </>
  );
}