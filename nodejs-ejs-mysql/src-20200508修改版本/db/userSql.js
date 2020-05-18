var UserSQL = {
    //插入数据  
    insert:'INSERT INTO manjian(storeId,storeName,activName,fullCut,billLimitStat,billLimitNum,activStartDate,activEndDate,dateStat,unDatePartWeek,unDatePart,timeStat,timePart,createUser,updateUser,status,delFlag) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    queryAll:'SELECT * FROM `manjian`',  //查询所有数据
    getDetailById:'SELECT * FROM `manjian` WHERE id = ? ', //查询数据by id
    // 更新数据by id
    update:'update manjian set storeId=?,storeName=?,activName=?,fullCut=?,billLimitStat=?,billLimitNum=?,activStartDate=?,activEndDate=?,dateStat=?,unDatePartWeek=?,unDatePart=?,timeStat=?,timePart=?,createUser=?,updateUser=?,status=?,delFlag=? where id=?',
    delete:'delete from `manjian` where id=?', //删除数据by id
  };
module.exports = UserSQL;