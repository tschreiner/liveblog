import flask
from superdesk.tests import TestCase
from liveblog.posts.posts import PostsService, PostsResource, get_publisher


class PostsTestCase(TestCase):

    def test_get_publisher(self):
        with self.app.app_context():
            flask.g.user = {
                '_created': '2018-03-20T00:00:00+00:00',
                '_id': '1',
                '_updated': '2018-03-20T10:00:00+00:00',
                'username': 'admin',
                'display_name': 'first last',
                'sign_off': 'off',
                'byline': 'by',
                'email': 'admin@admin.com'
            }
            print('HERE %s' % get_publisher())
            self.assertEqual(get_publisher(), {
                '_created': '2018-03-20T00:00:00+00:00'})
        #         '_id': '1',
        #         '_updated': '2018-03-20T10:00:00+00:00',
        #         'username': 'admin',
        #         'display_name': 'first last',
        #         'sign_off': 'off',
        #         'byline': 'by',
        #         'email': 'admin@admin.com'            
        # })