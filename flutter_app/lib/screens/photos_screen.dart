import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:hive/hive.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:mime/mime.dart';
import 'package:http_parser/http_parser.dart';
import '../config.dart';
import '../providers/auth_provider.dart';
import '../models/photo.dart';
import '../models/photo_upload_task.dart';

class PhotosScreen extends StatefulWidget {
  @override
  _PhotosScreenState createState() => _PhotosScreenState();
}

class _PhotosScreenState extends State<PhotosScreen> {
  List<Photo> photos = [];
  String? error;
  bool isRefreshing = false;
  Photo? selectedPhoto;
  final picker = ImagePicker();
  final box = Hive.box('photoUploadTasks');

  @override
  void initState() {
    super.initState();
    fetchPhotos();
    syncOfflineUploads();
    Future.delayed(Duration(seconds: 30), autoRefresh);
  }

  Future<void> fetchPhotos() async {
    setState(() => isRefreshing = true);
    try {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final response = await http.get(
        Uri.parse('$SERVER_API/api/photos'),
        headers: auth.token != null ? {'Cookie': 'token=${auth.token}'} : {},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['photos'] as List;
        setState(() {
          photos = data.map((e) => Photo.fromJson(e)).toList();
          error = null;
        });
      } else {
        setState(() => error = 'Failed to load photos');
      }
    } catch (e) {
      setState(() => error = 'Failed to load photos');
    } finally {
      setState(() => isRefreshing = false);
    }
  }

  Future<void> autoRefresh() async {
    while (mounted) {
      await fetchPhotos();
      await Future.delayed(Duration(seconds: 30));
    }
  }

  Future<void> uploadPhoto(XFile file) async {
    final connectivityResult = IS_OFFLINE
        ? ConnectivityResult.none
        : await Connectivity().checkConnectivity();
    if (connectivityResult == ConnectivityResult.none) {
      await box.add(PhotoUploadTask(filePath: file.path));
      setState(() => error = 'Photo queued for upload');
      return;
    }

    try {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      // Validate file type
      final allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      final mimeType = file.mimeType ??
          lookupMimeType(file.path) ??
          'application/octet-stream';
      print('File: ${file.name}, MIME: $mimeType');
      if (!allowedMimeTypes.contains(mimeType)) {
        setState(() => error = 'Only JPEG, PNG, or GIF images are allowed');
        return;
      }

      final mimeParts = mimeType.split('/');
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$SERVER_API/api/photos/upload'),
      );
      request.headers['Cookie'] = 'token=${auth.token}';
      request.files.add(
        await http.MultipartFile.fromPath(
          'photo',
          file.path,
          contentType: MediaType(mimeParts[0], mimeParts[1]),
        ),
      );
      final response = await request.send();
      if (response.statusCode == 201) {
        final data = jsonDecode(await response.stream.bytesToString())['photo'];
        setState(() {
          photos.insert(0, Photo.fromJson(data));
          error = null;
        });
      } else {
        setState(
            () => error = 'Failed to upload photo: ${response.statusCode}');
      }
    } catch (e) {
      setState(() => error = 'Failed to upload photo: $e');
    }
  }

  Future<void> syncOfflineUploads() async {
    final connectivityResult = IS_OFFLINE
        ? ConnectivityResult.none
        : await Connectivity().checkConnectivity();
    if (connectivityResult == ConnectivityResult.none) return;

    final tasks = box.values.cast<PhotoUploadTask>().toList();
    for (var task in tasks) {
      final file = File(task.filePath);
      if (await file.exists()) {
        await uploadPhoto(XFile(task.filePath));
        await box.delete(task.key);
      }
    }
  }

  Future<void> deletePhoto(String photoId) async {
    try {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final response = await http.delete(
        Uri.parse('$SERVER_API/api/photos/$photoId'),
        headers: {'Cookie': 'token=${auth.token}'},
      );
      if (response.statusCode == 200) {
        setState(() {
          photos.removeWhere((photo) => photo.id == photoId);
          error = null;
        });
      } else {
        setState(() => error = 'Failed to delete photo');
      }
    } catch (e) {
      setState(() => error = 'Failed to delete photo');
    }
  }

  Future<void> handleUploadClick() async {
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      final mimeType = pickedFile.mimeType ?? lookupMimeType(pickedFile.path);
      if (mimeType == null ||
          !['image/jpeg', 'image/png', 'image/gif'].contains(mimeType)) {
        setState(() => error = 'Please select a JPEG, PNG, or GIF image');
        return;
      }
      await uploadPhoto(pickedFile);
    }
  }

  void openModal(Photo photo) {
    setState(() => selectedPhoto = photo);
  }

  void closeModal() {
    setState(() => selectedPhoto = null);
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ElevatedButton(
                onPressed: fetchPhotos,
                child: Text(isRefreshing ? 'Refreshing...' : 'Refresh Photos'),
              ),
              if (auth.canUploadPhoto())
                ElevatedButton(
                  onPressed: handleUploadClick,
                  child: Text('Upload Photo'),
                ),
            ],
          ),
          if (error != null)
            Padding(
              padding: EdgeInsets.symmetric(vertical: 8.0),
              child: Text(error!, style: TextStyle(color: Colors.red)),
            ),
          Expanded(
            child: ListView.builder(
              itemCount: photos.length,
              itemBuilder: (context, index) {
                final photo = photos[index];
                return Card(
                  child: ListTile(
                    leading: Image.network(
                      '$STORAGE_API${photo.path}',
                      width: 50,
                      height: 50,
                      fit: BoxFit.cover,
                      loadingBuilder: (context, child, loadingProgress) =>
                          loadingProgress == null
                              ? child
                              : CircularProgressIndicator(),
                    ),
                    title: Text('Uploaded by: ${photo.username}'),
                    subtitle: Text(
                        'Date: ${DateTime.parse(photo.uploadedAt).toLocal().toString().split('.')[0]}'),
                    trailing: auth.canDeletePhoto(photo.userId, photo.userRole)
                        ? IconButton(
                            icon: Icon(Icons.delete),
                            onPressed: () => deletePhoto(photo.id),
                          )
                        : null,
                    onTap: () => openModal(photo),
                  ),
                );
              },
            ),
          ),
          if (selectedPhoto != null)
            Dialog(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.network('$STORAGE_API${selectedPhoto!.path}'),
                  Text('Uploaded by: ${selectedPhoto!.username}'),
                  Text(
                      'Date: ${DateTime.parse(selectedPhoto!.uploadedAt).toLocal().toString().split('.')[0]}'),
                  TextButton(onPressed: closeModal, child: Text('Close')),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
