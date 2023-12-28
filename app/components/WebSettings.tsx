export async function getWebSettings() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WEB_URL}/api/get-settings`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  const webProps = data[0];

  if (!webProps) {
    return new Error("No web settings available");
  }

  return webProps;
}
