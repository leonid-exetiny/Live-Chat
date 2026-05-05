from django.contrib.auth.models import User
from rest_framework import serializers
from chat.models import Room, Message


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'room', 'user', 'username', 'content', 'timestamp')
        read_only_fields = ('user', 'timestamp')


class RoomSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ('id', 'name', 'created_by', 'created_at', 'messages', 'message_count')
        read_only_fields = ('created_by', 'created_at')

    def get_message_count(self, obj):
        return obj.messages.count()

