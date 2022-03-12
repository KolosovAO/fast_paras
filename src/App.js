import { useState } from "react";
import { Paras } from "./Paras";

function App() {
  const [collection_url, setCollectionUrl] = useState("");

  return (
    <div>
      <input value={collection_url} onChange={e => setCollectionUrl(e.target.value)} />
      {collection_url.endsWith(".near") && <Paras collection_url={collection_url} />}
    </div>
  );
}

export default App;
