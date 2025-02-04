const spacing = {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px'
  };
  
  const breakpoints = {
    xs: '480px',
    sm: '768px',
    md: '1024px',
    lg: '1200px'
  };
  
  const shadows = {
    small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    large: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)'
  };
  
  const borderRadius = {
    small: '4px',
    medium: '8px',
    large: '16px'
  };
  
  const zIndex = {
    low: 10,
    medium: 100,
    high: 1000
  };
  
  const animations = {
    fadeIn: 'fadeIn 0.3s ease-in-out'
  };
  
  const  progressMargin ={ margin: "20px 20px" }
  const mixins = {
    flexCenter: () => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }),
    clearfix: () => ({
      '&::after': {
        content: '""',
        display: 'table',
        clear: 'both'
      }
    })
  };

  const TABLE_STYLE={
     padding: "10px", borderBottom: "1px solid #ddd" 
  }

  const DRINK_TABLE_STYLE ={
    
      padding: "7px",
      border: "1px solid #ddd",
      color: "white",
      backgroundColor: "#aa6f5e",
      borderRadius: "2px",
    
  }
  
  export { spacing, breakpoints, shadows, borderRadius, zIndex, animations, mixins, progressMargin, TABLE_STYLE,DRINK_TABLE_STYLE };