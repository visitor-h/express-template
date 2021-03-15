// 引用用户模版数据
import { food } from '../models'

const FoodController = {
    async getFoodData(req, res, next) {
        const {
            // 分页
            page=1,
            pageSize=20,
            name,   // 菜名
            tags,   // 功效介绍
            method, // 做菜方式
            level,  // 难易等级
        } = req.body

        const condition = {
            name,
            method,
            level
        }

        const whereSql = []
        let conditionSql = food.formatSqlCondition(condition)
        whereSql.push(conditionSql)

        if(tags) {
            whereSql.push('tags LIKE "%' + tags + '%"');
        }

        conditionSql = whereSql.filter(item => item).join(' and ')

        const foodSql = ['SELECT * FROM meau', conditionSql ? `WHERE ${conditionSql}` : '', `LIMIT ${(page-1)*pageSize}, ${pageSize}` ].join(' ')

        console.log(foodSql)

        try {
            const [result1, result2] = await Promise.all([
                // 分页数据
                food.sql(foodSql),
                // 总数
                food.sql(`SELECT count(*) as total FROM meau`)
            ])
            res.json({
                code: 200,
                message: "操作成功",
                data: {
                    list: result1.results,
                    total: result2.results[0].total
                },
                success: true
            })
        } catch (e) {
            res.json({ code: 0, message: "操作失败", data: e, success: false })
        }

    }
}

export default FoodController