import 'package:hive/hive.dart';

part 'photo_upload_task.g.dart';

@HiveType(typeId: 0)
class PhotoUploadTask extends HiveObject {
  @HiveField(0)
  final String filePath;

  PhotoUploadTask({required this.filePath});
}
