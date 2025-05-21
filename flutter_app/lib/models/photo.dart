class Photo {
  final String id;
  final String filename;
  final String path;
  final String userId;
  final String username;
  final String userRole;
  final String uploadedAt;

  Photo({
    required this.id,
    required this.filename,
    required this.path,
    required this.userId,
    required this.username,
    required this.userRole,
    required this.uploadedAt,
  });

  factory Photo.fromJson(Map<String, dynamic> json) {
    return Photo(
      id: json['id'],
      filename: json['filename'],
      path: json['path'],
      userId: json['userid'],
      username: json['username'],
      userRole: json['userrole'],
      uploadedAt: json['uploadedAt'],
    );
  }
}
