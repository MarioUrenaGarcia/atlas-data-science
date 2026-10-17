---
id: ponderacion-y-post-estratificacion
titulo: Ponderación y post-estratificación
titulo_en: Weighting and post-stratification
alias:
  - post-estratificación
  - pesos de encuesta
  - ajuste por ponderación
modulo: 5
submodulo: '5.1'
orden: 16
nivel: intermedio
prerrequisitos:
  - muestreo-estratificado
  - estimador-de-horvitz-thompson
relaciones:
  - tipo: relacionado
    id: media-ponderada
  - tipo: relacionado
    id: efecto-de-diseno
etiquetas:
  - pesos
  - calibración
  - encuestas en línea
  - composición de la muestra
resumen: >
  Después de recolectar los datos, cada grupo de la muestra recibe un peso igual a su participación
  en la población entre su participación en la muestra. Así la muestra ponderada reproduce la
  composición conocida de la población.
formula: 'w_h = \frac{W_h}{n_h/n}, \qquad \bar{y}_{\mathrm{post}} = \sum_{h=1}^{H} W_h\,\bar{y}_h'
visualizacion:
  componente: SamplingWeights
  parametros:
    modo: postestratificacion
    criterio: Escolaridad
    variable: Libros leídos al año
    decimales: 1
    grupos:
      - { nombre: Básica, poblacion: 0.45, muestra: 80, media: 2.1 }
      - { nombre: Media superior, poblacion: 0.30, muestra: 150, media: 4.3 }
      - { nombre: Superior, poblacion: 0.25, muestra: 270, media: 7.8 }
referencias:
  - clave: lohr
    capitulo: '8'
publicado: true
---

## Intuición

Una encuesta en línea sobre hábitos de lectura obtiene 500 respuestas, y más de la mitad viene de personas con estudios universitarios, aunque en la población son solo la cuarta parte. Como los universitarios leen más, el promedio de la muestra exagera cuántos libros se leen al año.

La **post-estratificación** corrige la composición después de recolectar los datos. Se conoce, por el censo, qué fracción de la población tiene cada nivel de escolaridad. A cada persona de la muestra se le asigna un peso: los grupos que quedaron subrepresentados pesan más de uno y los sobrerrepresentados menos. Con esos pesos, la muestra se comporta como si tuviera la composición correcta, y la media ponderada combina el promedio de cada grupo con su participación real en la población. La corrección funciona si, dentro de cada grupo, quienes respondieron se parecen a quienes no; no puede arreglar diferencias que los grupos no capturan.

## Definición

:::definicion[Post-estratificación]
La muestra de tamaño $n$ se clasifica en $H$ grupos (post-estratos) cuyas participaciones en la población $W_h = N_h/N$ se conocen por una fuente externa. Si el grupo $h$ tiene $n_h$ respondientes con media $\bar{y}_h$, cada uno recibe el peso relativo
$$
w_h = \frac{W_h}{n_h/n},
$$
y la media post-estratificada es
$$
\bar{y}_{\mathrm{post}} = \frac{\sum_h n_h w_h \bar{y}_h}{\sum_h n_h w_h} = \sum_{h=1}^{H} W_h\,\bar{y}_h.
$$
:::

Más en general, la **ponderación** asigna a cada unidad un peso $w_i$ que combina el peso de diseño $1/\pi_i$ con ajustes por no respuesta y por calibración a totales conocidos. La post-estratificación es el caso de calibración a una sola variable categórica. Su costo es un aumento de la varianza cuando los pesos son muy desiguales, medido por el efecto de diseño de Kish $1 + \mathrm{CV}^2(w)$.

:::nota[Qué significa cada símbolo]
- $H$: número de post-estratos; $h$: índice de grupo.
- $W_h = N_h/N$: participación del grupo en la población, conocida de antemano.
- $n_h$: respondientes del grupo; $n = \sum_h n_h$.
- $n_h/n$: participación del grupo en la muestra.
- $w_h$: peso de cada respondiente del grupo $h$.
- $\bar{y}_h$: media de la variable en los respondientes del grupo $h$.
- $\bar{y}_{\mathrm{post}}$: media post-estratificada.
:::

## Cómo usar la visualización

Las barras naranjas muestran qué fracción de la muestra tiene cada escolaridad; las líneas punteadas azules, la fracción en la población. Al reproducir, cada grupo recibe su peso, las barras se ajustan a las líneas y aparece la comparación entre la media sin ponderar y la media ponderada, con las medias de cada grupo como círculos de tamaño proporcional a su peso en la población.

Experimentos sugeridos:

- Observa el peso del grupo de escolaridad básica: cada respondiente vale casi tres personas.
- Compara las dos medias: la ponderada es más de un libro y medio menor.
- Revisa el efecto de diseño por ponderación y el tamaño efectivo: los 500 respondientes valen como unos 300.

## Ejemplo

Con los datos de la visualización:

1. Participaciones en la muestra: $80/500 = 0.16$, $150/500 = 0.30$, $270/500 = 0.54$.
2. Pesos: $0.45/0.16 = 2.81$, $0.30/0.30 = 1$ y $0.25/0.54 = 0.46$.
3. Media sin ponderar: $0.16 \cdot 2.1 + 0.30 \cdot 4.3 + 0.54 \cdot 7.8 = 5.84$ libros.
4. Media post-estratificada: $0.45 \cdot 2.1 + 0.30 \cdot 4.3 + 0.25 \cdot 7.8 = 4.19$ libros.
5. Efecto de diseño por ponderación: con $\sum w = 500$ y $\sum w^2 \approx 840.7$, vale $500 \cdot 840.7/500^2 = 1.68$; el tamaño efectivo es $500/1.68 \approx 297$.

:::figura[Ejemplo con dos grupos: una encuesta sobre actividad física con pocos hombres. Los hombres reciben peso 1.4 y las mujeres 0.78, y la proporción que hace ejercicio sube.]{componente="SamplingWeights"}
```yaml
modo: postestratificacion
criterio: Sexo
variable: Proporción que hace ejercicio
decimales: 2
grupos:
  - { nombre: Mujeres, poblacion: 0.51, muestra: 130, media: 0.42 }
  - { nombre: Hombres, poblacion: 0.49, muestra: 70, media: 0.58 }
```
:::

## Propiedades

- **La muestra ponderada reproduce las participaciones** $W_h$, que es el sentido de "calibrar".
- **Si las medias de los grupos son iguales, la ponderación no cambia la estimación**; solo importa cuando la variable difiere entre grupos.
- **Corrige el sesgo solo si dentro de cada grupo la no respuesta es ignorable**: los que respondieron de cada grupo deben parecerse en promedio a los que no.
- **Aumenta la varianza cuando los pesos son muy distintos**: el tamaño efectivo es $n/(1 + \mathrm{CV}^2(w))$.

:::figura[Propiedad sin efecto: en una encuesta sobre preferencia de horario, las tres regiones tienen la misma media; corregir la composición no mueve la estimación.]{componente="SamplingWeights"}
```yaml
modo: postestratificacion
criterio: Región
variable: Hora de entrada preferida
decimales: 1
grupos:
  - { nombre: Norte, poblacion: 0.25, muestra: 40, media: 8.5 }
  - { nombre: Centro, poblacion: 0.5, muestra: 200, media: 8.5 }
  - { nombre: Sur, poblacion: 0.25, muestra: 60, media: 8.5 }
```
:::

## Errores comunes

- **Post-estratificar con grupos casi vacíos.** Un grupo con 5 respondientes que representa el 20 % de la población recibe un peso enorme; esas cinco respuestas dominan la estimación y la varianza se dispara.
- **Creer que ponderar elimina cualquier sesgo.** Los pesos corrigen la composición en las variables usadas, no las diferencias entre respondientes y no respondientes dentro de cada grupo.
- **Usar participaciones poblacionales de otra población o de otro año**, por ejemplo proporciones nacionales para una encuesta de una sola ciudad.

:::figura[Error de grupos casi vacíos: una encuesta sobre ahorro para el retiro con solo 6 personas mayores de 60. Cada una pesa como trece y el efecto de diseño por ponderación crece mucho.]{componente="SamplingWeights"}
```yaml
modo: postestratificacion
criterio: Grupo de edad
variable: Ahorro mensual
unidad: pesos
decimales: 0
grupos:
  - { nombre: 18 a 34, poblacion: 0.4, muestra: 210, media: 650 }
  - { nombre: 35 a 59, poblacion: 0.4, muestra: 184, media: 1400 }
  - { nombre: 60 o más, poblacion: 0.2, muestra: 6, media: 2100 }
```
:::

## Conexiones

La post-estratificación aplica después de recolectar los datos la misma fórmula que el [[muestreo-estratificado]] aplica en el diseño, y es una [[media-ponderada]] con pesos que extienden los del [[estimador-de-horvitz-thompson]]. Su costo en precisión se mide con el [[efecto-de-diseno]]. Cuando se conocen las distribuciones de varias variables pero no sus cruces, se usa raking, y cuando el problema es que ciertas personas no responden, se combina con ajustes por no respuesta.

## Formulario

:::formula[Peso de post-estratificación]
$$
w_h = \frac{W_h}{n_h/n}
$$

- $W_h$: participación del grupo $h$ en la población.
- $n_h/n$: participación del grupo $h$ en la muestra.
:::

:::formula[Media post-estratificada]
$$
\bar{y}_{\mathrm{post}} = \sum_{h=1}^{H} W_h\,\bar{y}_h
$$

- $\bar{y}_h$: media de los respondientes del grupo $h$.
- $H$: número de grupos.
:::

:::formula[Efecto de diseño por ponderación]
$$
\text{deff}_w = \frac{n\sum_i w_i^2}{\left(\sum_i w_i\right)^2}, \qquad n_{\text{ef}} = \frac{n}{\text{deff}_w}
$$

- $w_i$: peso del respondiente $i$; $n$: número de respondientes.
- $n_{\text{ef}}$: tamaño efectivo de la muestra ponderada.
:::
