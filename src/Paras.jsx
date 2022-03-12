import { useEffect, useState } from 'react';
import './App.css';

const getRanks = async (collection_url) => {
    const response = await fetch(`https://api.neararity.com/tokens?collection=${collection_url}&page=1&itemsPerPage=3500&keyword=&sortBy=rank`);
    const collection = await response.json();

    return collection.paginated.reduce((acc, { index, rank, token_id }) => {
        acc[index === void 0 ? token_id : index] = rank;

        return acc;
    }, {});
}

const loadData = async (collection_url) => {
    const fetch_result = await fetch(`https://api-v2-mainnet.paras.id/token-series?collection_id=${collection_url}&exclude_total_burn=true&__limit=30&__sort=lowest_price::1&lookup_token=true`);
    return await fetch_result.json();
}

export const Paras = ({ collection_url }) => {
    const [ranks, setRanks] = useState({});
    const [items, setItems] = useState([]);

    useEffect(() => {
        getRanks(collection_url).then(setRanks);
        loadData(collection_url).then((res) => setItems(res.data.results));

        const interval = setInterval(() => {
            loadData(collection_url).then((res) => setItems(res.data.results));
        }, 3000);
        return () => clearInterval(interval);
    }, [collection_url]);


    return (
        <div>
            {items.map(({ token }) => {
                return (
                    <div key={token._id} style={{ display: "flex" }}>
                        <div style={{ width: "200px" }}>rank: {ranks[token.token_id]}</div>
                        <div style={{ width: "200px" }}>price: {(token.price.$numberDecimal / 10e23).toFixed(2)}</div>
                        <a rel="noreferrer noopener" target="_blank" href={`https://paras.id/token/${collection_url}::${token.token_id}/${token.token_id}`}>buy</a>
                    </div>
                )
            })}
        </div>
    );
};
