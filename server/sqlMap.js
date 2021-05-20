// sql语句
//sqlMap.js——SQL 语句映射文件，供 API 调用
var sqlMap = {
    user: {
        add: 'insert into server(id,name,class,o_num,S_id,C_id) values (?,?,?,?,?,?)',
        delete: 'delete from server where name=?',
        revise: 'update server set o_num=? where id=?;',

    },
    orders: {
        add: 'insert into orders(id,name,num,o_num,I_num,S_id) values (?,?,?,?,?,?)',
        revise: 'update orders set num=?,o_num=?,I_num=? where S_id=?;',
    },
    ord: {
        delete: 'delete from ord where name=?',
        addord: 'insert into ord(id,name,p_id,number) values (?,?,?,?)',

    }

}
module.exports = sqlMap