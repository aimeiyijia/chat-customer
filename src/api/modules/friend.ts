import fetch from '@/http';

/**
 * 群分页消息
 * @param params
 */
export async function getFriendMessage(params: PagingParams) {
  return await fetch.get(`/friend/friendMessages`, {
    params,
  });
}
