const fetch = require('node-fetch');
const { MessageEmbed, ReactionManager } = require('discord.js');
const functions = require('../../utils/functions.js');

module.exports = {
	name: 'quiz',
	aliases: [],
	description: 'Asks you some questions.',
	category: 'Fun',
	usage: '{prefix}quiz',

	async execute(client, message) {
		const response = await fetch('https://opentdb.com/api.php?amount=20');
		const data = await response.json();
		var length = data.results.length;

		var random = Math.floor(Math.random() * length);
		var questions = data.results[random];
		var category = questions.category;
		var type = questions.type;
		var difficulty = questions.difficulty;
		var question = questions.question;
		var correctAnswer = questions.correct_answer;
		var totalAnswers = questions.incorrect_answers;

		totalAnswers.push(correctAnswer);

		functions.shuffle(totalAnswers);

		if (type === 'boolean') type = 'True/False';

		const embed = new MessageEmbed()
			.setColor('#8c9eff')
			.setAuthor(`Basically a quiz`)
			.setTitle(question)
			.setDescription(
				`Category: ${category}\nType: ${functions.toTitleCase(
					type
				)}\nDifficulty: ${functions.toTitleCase(difficulty)}`
			)
			.setTimestamp();

		if (type.toLowerCase() === 'multiple') {
			embed.addFields(
				{ name: 'A', value: totalAnswers[0], inline: false },
				{ name: 'B', value: totalAnswers[1], inline: false },
				{ name: 'C', value: totalAnswers[2], inline: false },
				{ name: 'D', value: totalAnswers[3], inline: false }
			);

			let msg = await message.channel.send({ embeds: [embed] });

			const filter = (response) => {
				return ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'cancel'].some(
					(answer) =>
						answer.toLowerCase() === response.content.toLowerCase()
				);
			};

			await msg.channel
				.awaitMessages({
					filter,
					max: 1,
					time: 30000,
					errors: ['time'],
				})
				.then((response) => {
					const result = response.first();

					if (result.content.toLowerCase() === 'a') {
						if (totalAnswers[0] === correctAnswer) {
							message.channel.send(
								`${client.emotes.success} - Correct!`
							);
						} else
							message.channel.send(
								`${client.emotes.off} - Incorrect!`
							);
					} else if (result.content.toLowerCase() === 'b') {
						if (totalAnswers[1] === correctAnswer) {
							message.channel.send(
								`${client.emotes.success} - Correct!`
							);
						} else
							message.channel.send(
								`${client.emotes.off} - Incorrect!`
							);
					} else if (result.content.toLowerCase() === 'c') {
						if (totalAnswers[2] === correctAnswer) {
							message.channel.send(
								`${client.emotes.success} - Correct!`
							);
						} else
							message.channel.send(
								`${client.emotes.off} - Incorrect!`
							);
					} else if (result.content.toLowerCase() === 'd') {
						if (totalAnswers[3] === correctAnswer) {
							message.channel.send(
								`${client.emotes.success} - Correct!`
							);
						} else
							message.channel.send(
								`${client.emotes.off} - Incorrect!`
							);
					} else {
						return message.channel.send(
							`${client.emotes.off} - Incorrect!`
						);
					}
				});
		} else if (type.toLowerCase() === 'true/false') {
			embed.addFields(
				{ name: '1', value: totalAnswers[0], inline: false },
				{ name: '2', value: totalAnswers[1], inline: false }
			);

			let msg = await message.channel.send({ embeds: [embed] });

			const filter = (response) => {
				return ['1', '2', 'cancel'].some(
					(answer) =>
						answer.toLowerCase() === response.content.toLowerCase()
				);
			};

			await msg.channel
				.awaitMessages({
					filter,
					max: 1,
					time: 30000,
					errors: ['time'],
				})
				.then((response) => {
					const result = response.first();

					if (result.content.toLowerCase() === '1') {
						if (totalAnswers[0] === correctAnswer) {
							message.channel.send(
								`${client.emotes.success} - Correct!`
							);
						} else
							message.channel.send(
								`${client.emotes.off} - Incorrect!`
							);
					} else if (result.content.toLowerCase() === '2') {
						if (totalAnswers[1] === correctAnswer) {
							message.channel.send(
								`${client.emotes.success} - Correct!`
							);
						} else
							message.channel.send(
								`${client.emotes.off} - Incorrect!`
							);

                    } else if (result.content.toLowerCase() === 'cancel') {
						return message.channel.send(
							`${client.emotes.off} - Cancelled!`
						);
					} else {
						return message.channel.send(
							`${client.emotes.off} - Incorrect!`
						);
					}
				});
		}
	},
};
