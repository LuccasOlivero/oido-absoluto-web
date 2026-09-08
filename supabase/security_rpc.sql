-- Revoke EXECUTE on function get_email_by_username(text) from anon and authenticated.
REVOKE EXECUTE ON FUNCTION public.get_email_by_username(text) FROM anon, authenticated;

-- Grant EXECUTE on function get_email_by_username(text) to service_role.
GRANT EXECUTE ON FUNCTION public.get_email_by_username(text) TO service_role;
