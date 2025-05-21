// GENERATED CODE - DO NOT MODIFY BY HAND
part of 'photo_upload_task.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class PhotoUploadTaskAdapter extends TypeAdapter<PhotoUploadTask> {
  @override
  final int typeId = 0;

  @override
  PhotoUploadTask read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return PhotoUploadTask(
      filePath: fields[0] as String,
    );
  }

  @override
  void write(BinaryWriter writer, PhotoUploadTask obj) {
    writer
      ..writeByte(1)
      ..writeByte(0)
      ..write(obj.filePath);
  }
}