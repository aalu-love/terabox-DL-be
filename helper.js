const getLinkInfo = async (shorturl) => {
  try {
    const data = await fetch(
      "http://terabox-dl.qtcloud.workers.dev/api/get-info?shorturl=" + shorturl
    )
      .then((res) => res.json())
      .then((data) => {
        return {
          shareid: parseInt(data.shareid),
          uk: parseInt(data.uk),
          sign: data.sign,
          timestamp: parseInt(data.timestamp),
          fs_id: parseInt(data.list[0].fs_id),
          list: data.list,
        };
      });

    return data;
  } catch (err) {
    throw new Error("Failed to get information");
  }
};

const getDownloadLink = async (payload) => {
  try {
    const res = await fetch(
      "https://terabox-dl.qtcloud.workers.dev/api/get-download",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    ).then((response) => {
      if (response.status === 200) {
        const d = response.text().then((e) => {
          return e;
        });
        return d;
      }
    });
    return res;
  } catch (err) {
    throw new Error("Failed to get download link");
  }
};

module.exports = {
  getLinkInfo,
  getDownloadLink,
};
