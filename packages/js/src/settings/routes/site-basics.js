import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Radio, RadioGroup, TextField, ToggleField } from "@yoast/ui-library";
import { Field, useFormikContext } from "formik";
import { get, map } from "lodash";
import { FieldsetLayout, FormikMediaSelectField, FormikValueChangeField, FormLayout, OpenGraphDisabledAlert } from "../components";
import { useSelectLink, useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The site defaults route.
 */
const SiteBasics = () => {
	const separators = useMemo( () => get( window, "wpseoScriptData.separators", {} ), [] );
	const generalSettingsUrl = useSelectSettings( "selectPreference", [], "generalSettingsUrl" );
	const canManageOptions = useSelectSettings( "selectPreference", [], "canManageOptions", false );

	const usageTrackingLink = useSelectLink( {
		link: "https://yoa.st/usage-tracking-2",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "Usage tracking allows us to track some data about your site to improve our plugin. %1$sAllow us to track some data about your site to improve our plugin%2$s.", "wordpress-seo" ),
		id: "link-usage-tracking",
	} );
	const infoAlertText = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
			__( "You can use %1$sSite title%2$s, %1$sTagline%2$s and %1$sSeparator%2$s as variables when configuring the search appearance of your content.", "wordpress-seo" ),
			"<em>",
			"</em>"
		),
		{ em: <em /> }
	), [] );
	const canNotManageOptionsAlertText = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
			__( "We're sorry, you're not allowed to edit the %1$sSite title%2$s and %1$sTagline%2$s.", "wordpress-seo" ),
			"<em>",
			"</em>"
		),
		{ em: <em /> }
	), [] );
	const siteImageRecommendedSize = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening strong tag.
			 * %2$s expands to a closing strong tag.
			 * %3$s expands to the recommended image size.
			 */
			__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
			"<strong>",
			"</strong>",
			"1200x675px"
		),
		{
			strong: <strong className="yst-font-semibold" />,
		}
	), [] );
	const siteTitleDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "This field updates the %1$sSite title in your WordPress settings%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ `${ generalSettingsUrl }#blogname` } target="_blank" rel="noreferrer" />,
		}
	), [] );
	const taglineDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "This field updates the %1$sTagline in your WordPress settings%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ `${ generalSettingsUrl }#blogdescription` } target="_blank" rel="noreferrer" />,
		}
	), [] );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;

	return (
		<FormLayout
			title={ __( "Site basics", "wordpress-seo" ) }
			description={ __( "Configure the basics for your website.", "wordpress-seo" ) }
		>
			<div className="yst-max-w-5xl">
				<FieldsetLayout
					title={ __( "Site info", "wordpress-seo" ) }
					description={ __( "Set the basic info for your website. Note that some of these values can be used as variables when configuring the search appearance of your content.", "wordpress-seo" ) }
				>
					<Alert variant="info" id="alert-site-defaults-variables">
						{ infoAlertText }
						{ ! canManageOptions && <>&nbsp;{ canNotManageOptionsAlertText }</> }
					</Alert>
					<fieldset className="yst-min-width-0 yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
						<Field
							as={ TextField }
							type="text"
							name="blogname"
							id="input-blogname"
							label={ __( "Site title", "wordpress-seo" ) }
							description={ canManageOptions && siteTitleDescription }
							readOnly={ ! canManageOptions }
						/>
						<Field
							as={ TextField }
							type="text"
							name="blogdescription"
							id="input-blogdescription"
							label={ __( "Tagline", "wordpress-seo" ) }
							description={ canManageOptions && taglineDescription }
							readOnly={ ! canManageOptions }
						/>
					</fieldset>
					<RadioGroup label={ __( "Title separator", "wordpress-seo" ) } variant="inline-block">
						{ map( separators, ( { label, aria_label: ariaLabel }, value ) => (
							<Field
								key={ value }
								as={ Radio }
								type="radio"
								variant="inline-block"
								name="wpseo_titles.separator"
								id={ `input-wpseo_titles-separator-${ value }` }
								label={ label }
								isLabelDangerousHtml={ true }
								aria-label={ ariaLabel }
								value={ value }
							/>
						) ) }
					</RadioGroup>
					<OpenGraphDisabledAlert
						isEnabled={ opengraph }
						text={
							/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
							__( "The %1$sSite image%2$s requires Open Graph data, which is currently disabled in the ‘Social sharing’ section in %3$sSite features%4$s.", "wordpress-seo" )
						}
					/>
					<FormikMediaSelectField
						id="wpseo_social-og_default_image"
						label={ __( "Site image", "wordpress-seo" ) }
						description={ __( "This image is used as a fallback for posts/pages that don't have any images set.", "wordpress-seo" ) }
						previewLabel={ siteImageRecommendedSize }
						mediaUrlName="wpseo_social.og_default_image"
						mediaIdName="wpseo_social.og_default_image_id"
						disabled={ ! opengraph }
					/>
				</FieldsetLayout>

				<hr className="yst-my-8" />
				<FieldsetLayout title={ __( "Security & privacy", "wordpress-seo" ) }>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.disableadvanced_meta"
						data-id="input-wpseo-disableadvanced_meta"
						label={ __( "Restrict advanced settings for authors", "wordpress-seo" ) }
						description={ __( "By default only editors and administrators can access the Advanced - and Schema section of the Yoast SEO metabox. Disabling this allows access to all users.", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.tracking"
						data-id="input-wpseo-tracking"
						label={ __( "Usage tracking", "wordpress-seo" ) }
						description={ usageTrackingLink }
					/>
				</FieldsetLayout>
			</div>
		</FormLayout>
	);
};

export default SiteBasics;
