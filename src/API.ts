import axios, { AxiosRequestConfig } from 'axios';

import { API_BASE_URL } from './config/Config';
import Schematic from 'src/data/Schematic';
import Map from 'src/data/Map';

export class API {
	static REQUEST = axios.create({
		baseURL: API_BASE_URL,
		headers: { 'ngrok-skip-browser-warning': 'true' },
	});

	static setBearerToken(token: string) {
		API.REQUEST = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				'ngrok-skip-browser-warning': 'true',
				Authorization: 'Bearer ' + token,
			},
		});
	}

	static getTotalSchematic() {
		return API.REQUEST.get('schematic/total');
	}

	static getTotalSchematicUpload() {
		return API.REQUEST.get('schematic-upload/total');
	}

	static getTotalMap() {
		return API.REQUEST.get('map/total');
	}

	static getTotalMapUpload() {
		return API.REQUEST.get('map-upload/total');
	}

	static postNotification(userId: string, header: string, message: string) {
		let form = new FormData();
		form.append('userId', userId);
		form.append('header', header);
		form.append('message', message);
		return API.REQUEST.post('notification', form);
	}

	static markAsReadNotificationAll() {
		return API.REQUEST.put('notification/all');
	}

	static deleteNotificationAll() {
		return API.REQUEST.delete('notification/all');
	}

	static verifySchematic(schematic: Schematic, tagString: string) {
		let form = new FormData();

		form.append('id', schematic.id);
		form.append('authorId', schematic.authorId);
		form.append('data', schematic.data);
		form.append('tags', tagString);

		return API.REQUEST.post('schematic', form);
	}

	static rejectSchematic(schematic: Schematic, reason: string) {
		return API.REQUEST.delete(`schematic-upload/${schematic.id}`) //
			.then(() => API.postNotification(schematic.authorId, 'Your map submission has been reject', reason));
	}

	static verifyMap(map: Map, tagString: string) {
		let form = new FormData();

		form.append('id', map.id);
		form.append('authorId', map.authorId);
		form.append('data', map.data);
		form.append('tags', tagString);

		return API.REQUEST.post('schematic', form);
	}

	static rejectMap(map: Map, reason: string) {
		return API.REQUEST.delete(`map-upload/${map.id}`) //
			.then(() => API.postNotification(map.authorId, 'Your map submission has been reject', reason));
	}

	static postComment(url: string, targetId: string, message: string, contentType: string) {
		let form = new FormData();

		form.append('message', message);
		form.append('targetId', targetId);
		form.append('contentType', contentType);

		return API.REQUEST.post(url, form);
	}

	static deleteComment(contentType: string, commentId: string) {
		return API.REQUEST.delete(`comment/${contentType}/${commentId}`);
	}

	static getTagByName(tag: string) {
		return API.REQUEST.get(`tag/${tag}`);
	}

	static getUser(userId: string) {
		return API.REQUEST.get(`/user/${userId}`);
	}

	static getMe() {
		return API.REQUEST.get('/user/me');
	}

	static getUnreadNotification() {
		return API.REQUEST.get('notification/unread'); //
	}

	static getPing() {
		return API.REQUEST.get('ping'); //
	}

	static getLikes(contentType: string, targetId: string) {
		return API.REQUEST.get(`like/${contentType}/${targetId}/likes`);
	}

	static setLike(contentType: string, targetId: string) {
		return API.REQUEST.get(`like/${contentType}/${targetId}/like`);
	}

	static setDislike(contentType: string, targetId: string) {
		return API.REQUEST.get(`like/${contentType}/${targetId}/dislike`);
	}

	static get(url: string, searchConfig?: AxiosRequestConfig<any>) {
		return API.REQUEST.get(url, searchConfig);
	}

	static deleteLog(contentType: string, logId: string) {
		return API.REQUEST.delete(`log/${contentType}/${logId}`); //
	}

	static markNotificationAsRead(notificationId: string) {
		return API.REQUEST.put(`notification/${notificationId}`); //
	}

	static deleteNotification(notificationId: string) {
		return API.REQUEST.delete(`notification/${notificationId}`);
	}

	static deleteSchematic(schematicId: string) {
		return API.REQUEST.delete(`schematic/${schematicId}`); //
	}

	static deleteMap(mapId: string) {
		return API.REQUEST.delete(`map/${mapId}`); //
	}

	static getSchematicPreview(code: string, file: File | undefined) {
		const form = new FormData();
		if (file) form.append('file', file);
		else form.append('code', code);

		return API.REQUEST.post('schematic-upload/preview', form);
	}

	static getMapPreview(file: File | undefined) {
		const form = new FormData();
		if (file) form.append('file', file);

		return API.REQUEST.post('map-upload/preview', form);
	}

	static postSchematicUpload(code: string, file: File | undefined, tag: string) {
		const formData = new FormData();
		formData.append('tags', tag);

		if (file) formData.append('file', file);
		else formData.append('code', code);

		return API.REQUEST.post('schematic-upload', formData);
	}

	static postMapUpload(file: File, tag: string) {
		const formData = new FormData();
		formData.append('tags', tag);

		formData.append('file', file);

		return API.REQUEST.post('map-upload', formData);
	}

	static postMindustryServer(address: string) {
		const form = new FormData();
		form.append('address', address);

		return API.REQUEST.post('mindustry-server', form);
	}

	static deleteServer(id: string) {
		return this.REQUEST.delete(`mindustry-server/${id}`);
	}
}
