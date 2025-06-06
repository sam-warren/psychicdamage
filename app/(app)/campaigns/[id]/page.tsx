export default async function CampaignPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <div>Campaign Page {id}</div>;
}