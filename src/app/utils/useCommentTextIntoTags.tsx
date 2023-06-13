import useStore from "@/store/store";

const useCommentTextIntoTags = (text: string) => {
    const { users } = useStore();

    const isUser = (name: string) => {
        const userName = name.split("@")[1];
        return users.find((user) => user.username === userName) ? true : false;
    };
    const regEx = /(@\w+)/g;
    const result = text.split(regEx).map((item) => {
        return item[0] === "@" ? (
            isUser(item) ? (
                <span key={item}>{item}</span>
            ) : (
                item
            )
        ) : (
            item
        );
    });

    return result;
};

export { useCommentTextIntoTags };
