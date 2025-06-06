export default async function CreaturePage({ 
    params 
  }: { 
    params: Promise<{ id: string }> 
  }) {
    const { id } = await params;
    return <div>Creature Page {id}</div>;
  }