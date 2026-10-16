---
id: reproducibilidad
titulo: Reproducibilidad
titulo_en: Reproducibility
alias:
  - análisis reproducible
  - replicabilidad computacional
  - reproducible research
modulo: 12
submodulo: '12.1'
orden: 6
nivel: basico
prerrequisitos:
  - metodologia-crisp-dm
  - estimacion-de-probabilidades-por-simulacion-monte-carlo
etiquetas:
  - proceso
  - semilla aleatoria
  - control de versiones
  - buenas prácticas
resumen: >
  Un análisis es reproducible cuando, con los mismos datos, el mismo código y la misma semilla, cualquier
  persona obtiene exactamente los mismos resultados; exige fijar y registrar las tres cosas.
formula: 'r = f(\mathbf{D}_v,\ \mathcal{C}_w,\ s)'
visualizacion:
  componente: DataProjectViz
  parametros:
    modo: reproducibilidad
    fijar: []
referencias:
  - clave: kohavi
  - clave: mcelreath
publicado: true
---

## Intuición

Un analista reporta en marzo que cada hora adicional de estudio se asocia con 4.1 puntos más en el examen. En junio, alguien vuelve a correr "el mismo análisis" y obtiene 3.6. Nadie cometió un error a propósito: desde marzo llegaron registros nuevos a la base de datos, alguien agregó al código una regla para descartar calificaciones sospechosas y la partición aleatoria en entrenamiento y prueba se hizo con otra semilla. Cada cambio es pequeño, pero juntos impiden saber si la diferencia es real o es un artefacto.

Un resultado es **reproducible** cuando se puede volver a obtener, número por número, a partir de sus ingredientes. Eso requiere tres cosas: los datos exactos que se usaron (no "la tabla de clientes", sino su versión de esa fecha), el código exacto (con las versiones de sus dependencias) y el valor de toda fuente de azar, es decir, la semilla del generador de números aleatorios. Fijar solo una de las tres no basta.

## Definición

:::definicion[Reproducibilidad]
Un análisis es **reproducible** si su resultado $r$ es una función determinista de ingredientes registrados,

$$
r = f(\mathbf{D}_v,\ \mathcal{C}_w,\ s),
$$

de modo que cualquier persona con acceso a la versión $v$ de los datos, a la versión $w$ del código y a la semilla $s$ obtiene el mismo $r$.
:::

Se distingue de la **replicabilidad**, que pide obtener conclusiones consistentes con datos nuevos e independientes. Un resultado puede ser reproducible y no replicable (el cálculo se repite, pero la conclusión no se sostiene con otra muestra).

:::nota[Qué significa cada símbolo]
- $r$: resultado reportado, por ejemplo una pendiente, una métrica o una tabla.
- $f$: el análisis completo, desde la lectura de datos hasta el reporte.
- $\mathbf{D}_v$: versión $v$ del conjunto de datos, identificada por fecha o por una huella digital del archivo.
- $\mathcal{C}_w$: versión $w$ del código y de su entorno (bibliotecas y sus versiones).
- $s$: semilla del generador pseudoaleatorio que controla particiones, remuestreos e inicializaciones.
:::

## Cómo usar la visualización

El análisis estima la pendiente de la calificación contra las horas de estudio, con una partición aleatoria de 70 % para entrenamiento. Cada punto es una corrida y su altura es la pendiente reportada. Los tres interruptores fijan la semilla, la versión de los datos y la versión del código. Si un factor queda libre, cambia entre corridas como lo haría en un proyecto sin control: una semilla nueva en cada corrida, datos que crecen cada tres corridas y un cambio de código a la mitad.

La lectura "Resultados distintos" cuenta cuántas pendientes diferentes se obtuvieron. Experimentos sugeridos: fijar solo la semilla y observar que los resultados siguen cambiando; fijar los tres factores y comprobar que todas las corridas dan el mismo número.

## Ejemplo

Cinco estudiantes estudiaron 2, 4, 6, 8 y 10 horas y obtuvieron 55, 62, 70, 75 y 83 puntos. El análisis toma 4 de los 5 al azar y calcula la pendiente de mínimos cuadrados.

1. Con una semilla, la partición deja fuera al cuarto estudiante: $x = (2, 4, 6, 10)$, $y = (55, 62, 70, 83)$. Entonces $\bar{x} = 5.5$, $\bar{y} = 67.5$, $\sum (x_i - \bar{x})(y_i - \bar{y}) = 123$ y $\sum (x_i - \bar{x})^2 = 35$, así que $\hat{\beta}_1 = 123/35 = 3.514$.
2. Con otra semilla queda fuera el segundo: $x = (2, 6, 8, 10)$, $y = (55, 70, 75, 83)$, $\bar{x} = 6.5$, $\bar{y} = 70.75$, $\sum(x_i-\bar x)(y_i-\bar y) = 120.5$ y $\hat{\beta}_1 = 120.5/35 = 3.443$.
3. Con la semilla registrada, cualquiera que repita el análisis obtiene el mismo valor; sin registrarla, dos personas reportan 3.514 y 3.443 para "el mismo" análisis.

:::figura[Con la semilla, los datos y el código fijados, las doce corridas dan exactamente la misma pendiente.]{componente="DataProjectViz"}
```yaml
modo: reproducibilidad
fijar: [semilla, datos, codigo]
```
:::

## Propiedades

- **La variación por semilla es variación muestral.** Con datos y código fijos, cambiar la semilla produce una nube de resultados cuya dispersión indica cuánto depende la conclusión de la partición elegida.

:::figura[Con datos y código fijos, solo la semilla cambia: las pendientes forman una nube estrecha alrededor de un valor.]{componente="DataProjectViz"}
```yaml
modo: reproducibilidad
fijar: [datos, codigo]
```
:::

- **Los cambios de datos y de código producen saltos.** Agregar registros o una regla de limpieza mueve el resultado en escalones que se confunden con efectos reales si no se registran.
- **La reproducibilidad es condición de la comparación.** Para decidir si un modelo nuevo es mejor, ambos deben evaluarse con la misma versión de datos y la misma partición.

:::figura[Con la semilla fija pero datos y código libres, los resultados cambian en escalones: cada tres corridas llega una versión nueva de los datos y a la mitad cambia la regla de limpieza.]{componente="DataProjectViz"}
```yaml
modo: reproducibilidad
fijar: [semilla]
corridas: 14
```
:::

## Errores comunes

- **Creer que fijar la semilla basta.** La semilla solo controla el azar del código; si la consulta a la base de datos devuelve registros nuevos, el resultado cambia igual.
- **Escoger la semilla que da el mejor resultado.** Probar semillas hasta encontrar una métrica favorable es una forma de sobreajuste; la dispersión entre semillas debe reportarse, no esconderse.
- **Guardar el código sin sus dependencias.** Una versión distinta de una biblioteca puede cambiar valores por defecto (por ejemplo, el método de cálculo de cuantiles) y con ellos el resultado.

:::figura[Error de escoger la semilla: con datos y código fijos, cada semilla da una pendiente distinta; reportar solo la más alta exagera el efecto.]{componente="DataProjectViz"}
```yaml
modo: reproducibilidad
fijar: [datos, codigo]
corridas: 20
```
:::

## Conexiones

La reproducibilidad permite que cada vuelta de la [[metodologia-crisp-dm]] se compare con la anterior. Las simulaciones de la [[estimacion-de-probabilidades-por-simulacion-monte-carlo]] usan generadores pseudoaleatorios cuya semilla debe registrarse. La pendiente del ejemplo es la de la [[covarianza-muestral]] dividida entre la varianza de $x$, y cambiar de [[metodos-de-calculo-de-cuantiles|método de cálculo de cuantiles]] es un caso típico de diferencia entre versiones de código. Las decisiones tomadas al preparar los datos deben documentarse también por razones de [[etica-de-datos]].

## Formulario

:::formula[Resultado como función de sus ingredientes]
$$
r = f(\mathbf{D}_v,\ \mathcal{C}_w,\ s)
$$

- $r$: resultado reportado.
- $\mathbf{D}_v$: versión de los datos.
- $\mathcal{C}_w$: versión del código y del entorno.
- $s$: semilla aleatoria.
:::

:::formula[Pendiente de mínimos cuadrados]
$$
\hat{\beta}_1 = \frac{\sum_{i=1}^{m} (x_i - \bar{x})(y_i - \bar{y})}{\sum_{i=1}^{m} (x_i - \bar{x})^2}
$$

- $m$: número de observaciones en la partición de entrenamiento.
- $x_i$: horas de estudio; $y_i$: calificación.
- $\bar{x}$, $\bar{y}$: medias de la partición.
- $\hat{\beta}_1$: cambio estimado en la calificación por hora adicional.
:::
