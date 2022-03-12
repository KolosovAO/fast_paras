import { useState } from "react";
import { Paras } from "./Paras";

function App() {
  const [collection_url, setCollectionUrl] = useState("");
  const [delay, setDelay] = useState(2);
  const [pages, setPages] = useState(1);

  return (
    <div>
      <label>collection:</label>
      <input value={collection_url} onChange={e => setCollectionUrl(e.target.value)} />
      <label>request delay, s:</label>
      <input type="number" value={delay} onChange={e => setDelay(+e.target.value)} />
      <label>pages(30):</label>
      <input type="number" value={pages} onChange={e => setPages(+e.target.value)} />
      {collection_url.endsWith(".near") && <Paras collection_url={collection_url} timeout={delay} pages={pages} />}
    </div>
  );
}

export default App;
