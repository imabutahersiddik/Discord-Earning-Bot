async function checkCode(db, code, userid){
	try{
		var data = await db.getData("/" + userid);
		if(data == code){
			await db.delete("/" + userid);
			return true
		}else{
			return false
		}
	}catch{
		return false
	}

}
async function createCode(RandomString,db, userid, value){
	var code = RandomString(35)
	await db.push("/" + userid, code);
	return code;
}


module.exports = { checkCode, createCode }