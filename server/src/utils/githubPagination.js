export const fetchAllPages = async (
  octokit,
  endpoint,
  params = {}
) => {
  const results = [];

  for (let page = 1; page <= 10; page++) {
    const response = await octokit.request(endpoint, {
      ...params,
      per_page: 100,
      page
    });

    results.push(...response.data);

    if (response.data.length < 100) {
      break;
    }
  }

  return results;
};