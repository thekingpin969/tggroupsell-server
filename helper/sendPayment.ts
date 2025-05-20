import axios from 'axios'

async function sendPayment(amount: number, upiId: string, info: string = '') {
    try {
        const { MID, GUID, MKEY } = process.env
        const url = `https://full2sms.in/api/v2/payout?mid=${MID}&mkey=${MKEY}&guid=${GUID}&type=upi&amount=${amount}&upi=${upiId}&info=${info}`
        const { data } = await axios.get(url)
        console.log(data)
    } catch (error) {
        throw error
    }
}

export default sendPayment;