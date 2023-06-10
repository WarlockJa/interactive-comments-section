import { useEffect, useState } from "react";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

interface IUseFetchProps {
    api: string;
    request: RequestInit;
    initiateFetchFlag: boolean;
}

const useFetch = (props: IUseFetchProps) => {
    const [isLoading, setIsLoading] = useState(true);
    // using type any because anything can be fetched
    const [data, setData] = useState<any>(null);
    const [isError, setIsError] = useState<Error | null>(null);

    useEffect(() => {
        if (props.initiateFetchFlag) {
            fetch(props.api, props.request)
                .then((response) => response.json())
                .then((result) => setData(result))
                .catch((error) => {
                    setIsError(error.message);
                })
                .finally(() => {
                    setIsLoading(false);
                    console.log(props);
                });
        }
    }, [JSON.stringify(props)]);

    return { isError, isLoading, data };
};

export default useFetch;
