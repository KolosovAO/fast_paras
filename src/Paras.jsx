import { useEffect, useRef, useState } from 'react';

const getRanks = async (collection_url) => {
    const response = await fetch(`https://api.neararity.com/tokens?collection=${collection_url}&page=1&itemsPerPage=3500&keyword=&sortBy=rank`);
    const collection = await response.json();

    return collection.paginated.reduce((acc, { index, rank, token_id }) => {
        acc[index === void 0 ? token_id : index] = rank;

        return acc;
    }, {});
}

const loadData = async (collection_url, pages = 1, prev = []) => {
    let url = `https://api-v2-mainnet.paras.id/token-series?collection_id=${collection_url}&exclude_total_burn=true&__limit=30&__sort=lowest_price::1&lookup_token=true`;
    if (prev.length) {
        const last = prev[prev.length - 1];
        url += `&_id_next=${last._id}&lowest_price_next=${last.token.price.$numberDecimal}`;
    }
    const fetch_result = await fetch(url);
    const json = await fetch_result.json();
    const res = json.data.results;
    if (pages === 1) {
        return prev.concat(res);
    }

    return loadData(collection_url, pages - 1, prev.concat(res));
}

export const Paras = ({ collection_url, timeout, pages }) => {
    const timeout_ref = useRef(timeout);
    const pages_ref = useRef(pages);
    const [ranks, setRanks] = useState({});
    const [items, setItems] = useState([]);

    timeout_ref.current = timeout;
    pages_ref.current = pages;

    useEffect(() => {
        getRanks(collection_url).then(setRanks);

        let id;
        const reload = () => {
            id = setTimeout(() => {
                loadData(collection_url, pages_ref.current).then(setItems).then(reload);
            }, timeout_ref.current * 1000);
        };

        loadData(collection_url, pages_ref.current).then(setItems).then(reload);

        return () => clearTimeout(id);
    }, [collection_url]);

    return (
        <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", height: window.innerHeight - 100 }}>
            {items.map(({ token }) => {
                return (
                    <div key={token._id} style={{ display: "flex", borderRight: "1px solid black" }}>
                        <div style={{ width: 100, color: ranks[token.token_id] < 500 ? "red" : undefined }}>rank: {ranks[token.token_id]}</div>
                        <div style={{ width: 100 }}>price: {(token.price.$numberDecimal / 10e23).toFixed(2)}</div>
                        <a rel="noreferrer noopener" target="_blank" href={`https://paras.id/token/${collection_url}::${token.token_id}/${token.token_id}`}>buy</a>
                    </div>
                )
            })}
        </div>
    );
};
