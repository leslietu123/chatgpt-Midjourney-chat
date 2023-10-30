export default function ShareInfo (){
    const shareinfo=[
        {
            id:1,
            title:"#分享方式",
            content:"复制专属邀请码或者邀请链接给你的朋友或微信群内，通过专属邀请码注册以及首次消费后系统自动发放奖励",
        },
        {
            id:2,
            title:"#分享次数",
            content:"不限",
        },
        {
            id:3,
            title:"#分享奖励发放",
            content:"即时发放",
        },
        {
            id:4,
            title:"#奖励规则",
            content:"1.当有用户通过你的专属邀请码进行注册即可获得100积分；2.当有您邀请的用户在我方平台首次消费任意金额时可获得300积分奖励（仅首次）",
        },

    ]
    return(

      <div>
            {shareinfo.map((item)=>{
                return(
                    <div key={item.id}>
                        <h5>{item.title}</h5>
                        <p style={{fontSize:"12px"}}>{item.content}</p>
                    </div>
                )

            })
            }
      </div>
    );
}