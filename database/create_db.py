import mysql.connector

def execute_sql_file(file_path, connection_config):
    with open(file_path, 'r') as file:
        sql_script = file.read()
    statements = sql_script.split(';')

    try:
        # 建立数据库连接
        connection = mysql.connector.connect(**connection_config)
        cursor = connection.cursor()

        for statement in statements:
            clean_statement = statement.strip()
            if clean_statement:
                cursor.execute(clean_statement)
                if cursor.with_rows:
                    print("Query executed:", clean_statement)
                else:
                    print("Rows affected:", cursor.rowcount)
        
        # 提交更改
        connection.commit()
        print("SQL script executed successfully.")

    except Exception as e:
        print(f"Error executing SQL script: {e}")
        connection.rollback()

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("Database connection closed.")

# 数据库连接配置
config = {
    'user': 'root',
    'password': 'Liang_admin_2020',
    'host': '61.171.56.226',
    'database': 'sui_db_test'
}

# 执行SQL脚本
execute_sql_file('table.sql', config)