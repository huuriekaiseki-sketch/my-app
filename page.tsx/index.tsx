import { useEffect, useState } from "react";

type Data = {
  message: string;
};

export default function Home() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/hello");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Hello from Next.js (Pages Router)</h1>
      <p>API says: {data ? data.message : "Loading..."}</p>
    </div>
  );
}
