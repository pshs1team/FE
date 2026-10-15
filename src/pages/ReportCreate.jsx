import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowDropDownLine, RiCloseLine, RiImageLine, RiAddLine } from 'react-icons/ri';

import { createReport } from '../api/reportApi';
import { LOCATIONS } from '../data/mockData';
import { toPreviewDataUrl } from '../utils/format';
import '../styles/report-form.css';

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

function Select({ value, onChange, placeholder, options, disabled }) {
  return (
    <div className="select-wrap">
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <RiArrowDropDownLine />
    </div>
  );
}

// 신고 작성: 위치 선택, 시설 입력, 신고 내용 입력, 사진 첨부
function ReportCreate() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [place, setPlace] = useState('');
  const [facility, setFacility] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const floors = building ? Object.keys(LOCATIONS[building]) : [];
  const places = building && floor ? LOCATIONS[building][floor] : [];

  const clearError = (key) => setErrors((prev) => ({ ...prev, [key]: '' }));

  const handleBuilding = (value) => {
    setBuilding(value);
    setFloor('');
    setPlace('');
  };

  const handleFloor = (value) => {
    setFloor(value);
    setPlace('');
  };

  const handlePlace = (value) => {
    setPlace(value);
    clearError('location');
  };

  const handleFiles = async (e) => {
    const files = [...e.target.files];
    e.target.value = '';

    const room = MAX_PHOTOS - photos.length;
    const valid = files.filter(
      (file) => ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE,
    );

    let photoError = '';
    if (valid.length < files.length) photoError = 'JPG, PNG 파일만 5MB 이하로 첨부할 수 있습니다.';
    if (valid.length > room) photoError = `사진은 최대 ${MAX_PHOTOS}장까지 첨부할 수 있습니다.`;
    setErrors((prev) => ({ ...prev, photos: photoError }));

    const added = await Promise.all(
      valid.slice(0, room).map(async (file) => ({
        name: file.name,
        dataUrl: await toPreviewDataUrl(file),
      })),
    );
    setPhotos((prev) => [...prev, ...added]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    clearError('photos');
  };

  const validate = () => {
    const next = {};
    if (!building || !floor || !place) next.location = '건물, 층, 교실/장소를 모두 선택해 주세요.';
    if (!facility.trim()) next.facility = '고장 난 시설을 입력해 주세요.';
    if (!content.trim()) next.content = '신고 내용을 입력해 주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // 바로 이 페이지로 들어온 경우엔 돌아갈 곳이 없으므로 홈으로 이동
  const handleCancel = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const report = await createReport({
        building,
        floor,
        place,
        facility: facility.trim(),
        content: content.trim(),
        photos,
      });
      navigate(`/reports/${report.id}`, { replace: true });
    } catch (error) {
      setSubmitError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">신고 작성</h1>
      <p className="page-desc">학교 시설물 파손 및 고장에 대해 신고해 주세요</p>

      <form className="report-form card" onSubmit={handleSubmit} noValidate>
        <section className="form-section">
          <span className="form-label">
            위치<span className="required">*</span>
          </span>
          <div className="location-selects">
            <Select
              value={building}
              onChange={handleBuilding}
              placeholder="건물 선택"
              options={Object.keys(LOCATIONS)}
            />
            <Select
              value={floor}
              onChange={handleFloor}
              placeholder="층 선택"
              options={floors}
              disabled={!building}
            />
            <Select
              value={place}
              onChange={handlePlace}
              placeholder="교실/장소 선택"
              options={places}
              disabled={!floor}
            />
          </div>
          {errors.location && <p className="field-error">{errors.location}</p>}
        </section>

        <section className="form-section">
          <label className="form-label" htmlFor="facility">
            시설<span className="required">*</span>
          </label>
          <input
            id="facility"
            className="form-input"
            value={facility}
            onChange={(e) => {
              setFacility(e.target.value);
              clearError('facility');
            }}
            placeholder="고장난 시설을 입력해 주세요. (예: 책상, 에어컨, 형광등)"
            maxLength={50}
          />
          {errors.facility && <p className="field-error">{errors.facility}</p>}
        </section>

        <section className="form-section">
          <label className="form-label" htmlFor="content">
            신고 내용<span className="required">*</span>
          </label>
          <textarea
            id="content"
            className="form-textarea"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              clearError('content');
            }}
            placeholder="어떤 문제가 발생했는지 자세히 적어 주세요."
            maxLength={1000}
          />
          {errors.content && <p className="field-error">{errors.content}</p>}
        </section>

        <div className="form-footer">
          <section className="form-section">
            <span className="form-label">사진 첨부</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              hidden
              onChange={handleFiles}
            />
            <div className="photo-list">
              {photos.length === 0 ? (
                <button
                  type="button"
                  className="photo-drop"
                  onClick={() => fileInputRef.current.click()}
                >
                  <RiImageLine />
                  사진을 첨부해 주세요
                  <small>JPG, PNG (최대 5MB)</small>
                </button>
              ) : (
                photos.map((photo, index) => (
                  <div key={`${photo.name}-${index}`} className="photo-item">
                    <img src={photo.dataUrl} alt={photo.name} />
                    <button
                      type="button"
                      className="photo-remove"
                      onClick={() => removePhoto(index)}
                      aria-label={`${photo.name} 삭제`}
                    >
                      <RiCloseLine />
                    </button>
                  </div>
                ))
              )}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  className="photo-drop photo-add"
                  onClick={() => fileInputRef.current.click()}
                >
                  <RiAddLine />
                  사진 추가
                </button>
              )}
            </div>
            {errors.photos && <p className="field-error">{errors.photos}</p>}
          </section>

          <div className="form-actions">
            <button type="button" className="btn btn-soft" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '제출 중...' : '신고하기'}
            </button>
          </div>
        </div>

        {submitError && <p className="form-error">{submitError}</p>}
      </form>
    </div>
  );
}

export default ReportCreate;
