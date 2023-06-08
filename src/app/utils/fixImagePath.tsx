// this function removes a dot, if present, from the image path for the NextJS/Image to process correctly
const fixImagePath = (path: string) => {
    return path ? (path[0] === "." ? path.slice(1) : path) : "";
};

export default fixImagePath;
