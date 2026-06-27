-- ⚠️  DESTRUCTIVE — DO NOT RUN AGAINST PRODUCTION.
--
-- Drops every CMS table (current and from earlier schema iterations),
-- DESTROYING ALL DATA. Use only to reset a local/dev database before
-- re-running schema.sql. There is no undo.

drop table if exists case_study_portfolio_media cascade;
drop table if exists case_study_portfolio_items cascade;
drop table if exists case_study_results cascade;
drop table if exists case_study_media_labels cascade;
drop table if exists case_study_execution_points cascade;
drop table if exists case_study_strategy_points cascade;
drop table if exists case_studies cascade;
drop table if exists portfolio_media cascade;
drop table if exists portfolio_items cascade;
drop table if exists portfolio_formats cascade;
drop table if exists portfolio_categories cascade;
drop table if exists inventory_media cascade;
drop table if exists inventory_items cascade;
drop table if exists brands cascade;

drop table if exists portfolio_works cascade;
drop table if exists media_inventory cascade;
