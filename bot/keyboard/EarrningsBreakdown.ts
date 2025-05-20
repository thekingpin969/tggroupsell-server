import { Context } from 'telegraf';

async function EarningsBreakdown(ctx: Context) {

    await ctx.reply(`Here is the breakdown of your earnings
        
<b><u>▫️Group selling</u></b>
    • created btw jan 1 2021 and dec 31 2022
        - 235rs for group
        - 50rs for *message requirement
    • created btw jan 1 2020 and dec 31 2020
        - 280rs for group
        - 50rs for *message requirement
    • created btw jan 1 2019 and dec 31 2019
        - 330rs for group
        - 50rs for *message requirement
    • created before jan 1 2019
        - 400rs for group
        - 50rs for *message requirement

<b><u>▫️Referral Earning</u></b>
    • You earn 5% of your referral's earnings 
      on each group sale they make

<i>*message requirement: if your group has more than 5 messages within the first month.</i>
`, { parse_mode: 'HTML' })
}

export default EarningsBreakdown;
