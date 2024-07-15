const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 'nen1fer';
const REPO_NAME = 'for-practice';
const FILE_PATH = 'schedule.json';
const BRANCH = 'main';
const TOKEN = '${MY_TOKEN}';

 export async function getShaOfFile() {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: { Authorization: `token ${TOKEN} ` },
            params: { ref: BRANCH }
        });
        return response.data.sha;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        } else {
            throw error;
        }
    }
}

 export async function fetchSchedule() {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3.raw' }
        });

        const content = response.data;
        console.log('Schedule fetched:', content);

        if (Array.isArray(content)) {
            return content;
        } else {
            const parsedContent = JSON.parse(content);
            return Array.isArray(parsedContent) ? parsedContent : [];
        }
    } catch (error) {
        console.error('Error fetching schedule:', error.response ? error.response.data : error.message);
        return [];
    }
}

 export async function updateSchedule(data) {
    try {
        const fileSha = await getShaOfFile();
        const jsonPayload = JSON.stringify(data, null, 2);
        const contentBase64 = btoa(unescape(encodeURIComponent(jsonPayload)));
        const response = await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Update schedule',
            content: contentBase64,
            sha: fileSha ,
            branch: BRANCH
        }, {
            headers: { Authorization: `token ${TOKEN}` }
        });
        console.log('Schedule updated:', response.data);
    } catch (error) {
        console.error('Error updating schedule:', error.response ? error.response.data : error.message);
    }
}









