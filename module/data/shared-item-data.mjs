export default function getSharedItemData() {
  const fields = foundry.data.fields;

  return {
    description: new fields.HTMLField(),
  };
}
