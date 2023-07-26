const supabase = require("@supabase/supabase-js");

module.exports = {
	name: "taskArchive",
	async execute() {
		const client = supabase.createClient(
			process.env.SUPABASE_URL,
			process.env.SUPABASE_KEY
		);

		// fetch data
		const { data: fetched_data, err: fetched_arr } = await client
			.from("tasks")
			.select("guild_id, user_id, task_name, done")
			.order("created_at", { ascending: true });
		if (fetched_arr) {
			const error_date = new Date();
			const year = error_date.getFullYear(),
				month = error_date.getMonth() + 1,
				day = error_date.getDate();
			const hour = error_date.getHours(),
				minutes = error_date.getMinutes(),
				seconds = error_date.getSeconds();
			console.error(
				`${year}/${month}/${day} ${hour}:${minutes}:${seconds} Fetch failed in archive.js`
			);
			return;
		}

		// archive data
		const date = new Date();
		const archiveData = fetched_data.map((task, index) => {
			const formattedDate = new Date(date.getTime() + index * 1000)
				.toISOString()
				.replace("T", " ")
				.replace(/\.\d+Z$/, "");

			return {
				guild_id: task["guild_id"],
				user_id: task["user_id"],
				task_name: task["task_name"],
				archived_at: formattedDate,
			};
		});

		// insert to archived table
		const { error: insert_arr } = await client
			.from("archived")
			.insert(archiveData);
		if (insert_arr) {
			const error_date = new Date();
			const year = error_date.getFullYear(),
				month = error_date.getMonth() + 1,
				day = error_date.getDate();
			const hour = error_date.getHours(),
				minutes = error_date.getMinutes(),
				seconds = error_date.getSeconds();
			console.error(
				`${year}/${month}/${day} ${hour}:${minutes}:${seconds} Insert failed in archive.js`
			);
			return;
		}

		// remove old data
		const { delete_error } = await client
			.from("tasks")
			.delete()
      .in("done", [true]);
			// .in("done", [true, false]);
		if (delete_error) {
			const error_date = new Date();
			const year = error_date.getFullYear(),
				month = error_date.getMonth() + 1,
				day = error_date.getDate();
			const hour = error_date.getHours(),
				minutes = error_date.getMinutes(),
				seconds = error_date.getSeconds();
			console.error(
				`${year}/${month}/${day} ${hour}:${minutes}:${seconds} Delete failed in archive.js`
			);
			return;
		}
	},
};
