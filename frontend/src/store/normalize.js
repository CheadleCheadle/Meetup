export default function normalize(data) {
    const normalizeData = {};
    data.forEach((val) => normalizeData[val.id] = val);
    return normalizeData;

}
